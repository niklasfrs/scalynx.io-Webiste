#!/usr/bin/env bash
set -euo pipefail

APEX_DOMAIN="scalynx.io"
WWW_DOMAIN="www.scalynx.io"
APEX_URL="https://scalynx.io/"
WWW_URL="https://www.scalynx.io/"
TARGET_CNAME="scalynx-io.pages.dev."

RESOLVERS=(
  "1.1.1.1"
  "8.8.8.8"
  "9.9.9.9"
  "208.67.222.222"
)

echo "Checking DNS records..."
for resolver in "${RESOLVERS[@]}"; do
  echo "- Resolver ${resolver}"

  apex_ips="$(dig @"${resolver}" +short "${APEX_DOMAIN}" A)"
  if [[ -z "${apex_ips}" ]]; then
    echo "ERROR: ${APEX_DOMAIN} has no A record on resolver ${resolver}"
    exit 1
  fi

  www_cname="$(dig @"${resolver}" +short "${WWW_DOMAIN}" CNAME)"
  if [[ "${www_cname}" != "${TARGET_CNAME}" ]]; then
    echo "ERROR: ${WWW_DOMAIN} CNAME mismatch on resolver ${resolver}. Got: ${www_cname:-<empty>}"
    exit 1
  fi

  www_ips="$(dig @"${resolver}" +short "${WWW_DOMAIN}" A)"
  if [[ -z "${www_ips}" ]]; then
    echo "ERROR: ${WWW_DOMAIN} has no A record on resolver ${resolver}"
    exit 1
  fi
done

echo "Checking HTTPS endpoint for apex domain..."
apex_status="$(curl -sS -o /dev/null -w "%{http_code}" "${APEX_URL}")"
if [[ "${apex_status}" != "200" ]]; then
  echo "ERROR: ${APEX_URL} returned status ${apex_status}, expected 200"
  exit 1
fi

echo "Checking HTTPS redirect for www domain..."
www_headers="$(curl -sSI "${WWW_URL}")"
www_status="$(printf "%s\n" "${www_headers}" | awk 'toupper($1) ~ /^HTTP\// {print $2; exit}')"
www_location="$(printf "%s\n" "${www_headers}" | awk 'tolower($1)=="location:" {print $2; exit}' | tr -d '\r')"

if [[ "${www_status}" != "301" ]]; then
  echo "ERROR: ${WWW_URL} returned status ${www_status:-<empty>}, expected 301"
  exit 1
fi

if [[ "${www_location}" != "${APEX_URL}" ]]; then
  echo "ERROR: ${WWW_URL} redirects to ${www_location:-<empty>}, expected ${APEX_URL}"
  exit 1
fi

echo "All checks passed."
