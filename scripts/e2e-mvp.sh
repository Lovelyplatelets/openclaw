#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000/api}"
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
  local path="$1"
  local json="$2"
  python3 - "$path" "$json" <<'PY'
import json,sys
path=sys.argv[1].split('.')
obj=json.loads(sys.argv[2])
for p in path:
    obj=obj[p]
print(obj)
PY
}

echo "[1/9] register"
REG_RESP=$(curl -sS -X POST "$BASE_URL/users" -H 'Content-Type: application/json' -d "{\"user\":{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}}")
if [ -z "$REG_RESP" ]; then
  echo "register empty response from $BASE_URL/users"
  exit 1
fi
TOKEN=$(json_get user.token "$REG_RESP")

if [ -z "$TOKEN" ]; then
  echo "register failed: $REG_RESP"
  exit 1
fi

AUTH_HEADER="Authorization: Token $TOKEN"

echo "[2/9] login"
LOGIN_RESP=$(curl -sS -X POST "$BASE_URL/users/login" -H 'Content-Type: application/json' -d "{\"user\":{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}}")
json_get user.token "$LOGIN_RESP" >/dev/null

echo "[3/9] current user"
ME_RESP=$(curl -sS "$BASE_URL/user" -H "$AUTH_HEADER")
json_get user.email "$ME_RESP" >/dev/null

echo "[4/9] create article"
TITLE="Article $TS"
CREATE_ARTICLE_RESP=$(curl -sS -X POST "$BASE_URL/articles" -H 'Content-Type: application/json' -H "$AUTH_HEADER" -d "{\"article\":{\"title\":\"$TITLE\",\"description\":\"desc\",\"body\":\"body\",\"tagList\":[\"tag-a\",\"tag-b\"]}}")
SLUG=$(json_get article.slug "$CREATE_ARTICLE_RESP")

if [ -z "$SLUG" ]; then
  echo "create article failed: $CREATE_ARTICLE_RESP"
  exit 1
fi

echo "[5/9] article list"
LIST_RESP=$(curl -sS "$BASE_URL/articles")
json_get articlesCount "$LIST_RESP" >/dev/null

echo "[6/9] article detail"
DETAIL_RESP=$(curl -sS "$BASE_URL/articles/$SLUG")
json_get article.slug "$DETAIL_RESP" >/dev/null

echo "[7/9] add comment"
COMMENT_RESP=$(curl -sS -X POST "$BASE_URL/articles/$SLUG/comments" -H 'Content-Type: application/json' -H "$AUTH_HEADER" -d '{"comment":{"body":"nice"}}')
COMMENT_ID=$(json_get comment.id "$COMMENT_RESP")

echo "[8/9] tags"
TAGS_RESP=$(curl -sS "$BASE_URL/tags")
json_get tags "$TAGS_RESP" >/dev/null

echo "[9/9] delete comment"
curl -sS -X DELETE "$BASE_URL/articles/$SLUG/comments/$COMMENT_ID" -H "$AUTH_HEADER" >/dev/null

echo "MVP e2e passed"
