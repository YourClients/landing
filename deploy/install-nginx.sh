#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/yclients-landing}"
SITE_DOMAIN="${SITE_DOMAIN:-yclients.antonbutov.com}"
WEB_ROOT="${WEB_ROOT:-/var/www/yclients.antonbutov.com}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-mail@antonbutov.com}"
SITE="/etc/nginx/sites-available/${SITE_DOMAIN}"

mkdir -p /var/www/certbot "${WEB_ROOT}"

if [[ -f "/etc/letsencrypt/live/${SITE_DOMAIN}/fullchain.pem" ]]; then
  cp "${DEPLOY_PATH}/yclients.antonbutov.com.nginx.conf" "${SITE}"
else
  cp "${DEPLOY_PATH}/yclients.antonbutov.com.nginx.http.conf" "${SITE}"
fi

ln -sf "${SITE}" "/etc/nginx/sites-enabled/${SITE_DOMAIN}"
rm -f /etc/nginx/sites-enabled/ycliend.antonbutov.com
nginx -t
systemctl reload nginx

if [[ ! -f "/etc/letsencrypt/live/${SITE_DOMAIN}/fullchain.pem" ]]; then
  if certbot certonly --webroot -w /var/www/certbot \
    -d "${SITE_DOMAIN}" \
    --non-interactive --agree-tos --email "${CERTBOT_EMAIL}"; then
    cp "${DEPLOY_PATH}/yclients.antonbutov.com.nginx.conf" "${SITE}"
    nginx -t
    systemctl reload nginx
  else
    echo "WARN: certbot failed for ${SITE_DOMAIN}; site stays on HTTP until DNS/TLS is ready"
  fi
fi
