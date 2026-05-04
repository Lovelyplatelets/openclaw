#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api}"
TS="$(date +%s)"
USERNAME="user_${TS}"
EMAIL="${USERNAME}@example.com"
PASSWORD="Passw0rd!"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "missing command: $1"; exit 1; }
}

require_cmd curl
require_cmd python3

json_get() {
  python3 - "$1" <<'PY'
import json,sys
path=sys.argv[1].split('.')
obj=json.loads(sys.stdin.read())
for p in path:
    obj=obj[p]
print(obj)
PY
}

echo "[1/9] register"
REG_RESP=$(curl -sS -X POST "$BASE_URL/users" -H 'Content-Type: application/json' -d "{\"user\":{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}}")
TOKEN=$(printf '%s' "$REG_RESP" | json_get user.token)

if [ -z "$TOKEN" ]; then
  echo "register failed: $REG_RESP"
  exit 1
fi

AUTH_HEADER="Authorization: Token $TOKEN"

echo "[2/9] login"
LOGIN_RESP=$(curl -sS -X POST "$BASE_URL/users/login" -H 'Content-Type: application/json' -d "{\"user\":{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}}")
printf '%s' "$LOGIN_RESP" | json_get user.token >/dev/null

echo "[3/9] current user"
ME_RESP=$(curl -sS "$BASE_URL/user" -H "$AUTH_HEADER")
printf '%s' "$ME_RESP" | json_get user.email >/dev/null

echo "[4/9] create article"
TITLE="Article $TS"
CREATE_ARTICLE_RESP=$(curl -sS -X POST "$BASE_URL/articles" -H 'Content-Type: application/json' -H "$AUTH_HEADER" -d "{\"article\":{\"title\":\"$TITLE\",\"description\":\"desc\",\"body\":\"body\",\"tagList\":[\"tag-a\",\"tag-b\"]}}")
SLUG=$(printf '%s' "$CREATE_ARTICLE_RESP" | json_get article.slug)

if [ -z "$SLUG" ]; then
  echo "create article failed: $CREATE_ARTICLE_RESP"
  exit 1
fi

echo "[5/9] article list"
LIST_RESP=$(curl -sS "$BASE_URL/articles")
printf '%s' "$LIST_RESP" | json_get articlesCount >/dev/null

echo "[6/9] article detail"
DETAIL_RESP=$(curl -sS "$BASE_URL/articles/$SLUG")
printf '%s' "$DETAIL_RESP" | json_get article.slug >/dev/null

echo "[7/9] add comment"
COMMENT_RESP=$(curl -sS -X POST "$BASE_URL/articles/$SLUG/comments" -H 'Content-Type: application/json' -H "$AUTH_HEADER" -d '{"comment":{"body":"nice"}}')
COMMENT_ID=$(printf '%s' "$COMMENT_RESP" | json_get comment.id)

echo "[8/9] tags"
TAGS_RESP=$(curl -sS "$BASE_URL/tags")
printf '%s' "$TAGS_RESP" | json_get tags >/dev/null

echo "[9/9] delete comment"
curl -sS -X DELETE "$BASE_URL/articles/$SLUG/comments/$COMMENT_ID" -H "$AUTH_HEADER" >/dev/null

echo "MVP e2e passed"
