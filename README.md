# Landing — приложение для записи клиентов (салон красоты)

Статический лендинг. Деплой на **91.207.75.72** → **https://yclients.antonbutov.com**

## DNS

У регистратора домена **antonbutov.com** добавьте запись:

| Тип | Имя / Host | Значение | TTL |
|-----|------------|----------|-----|
| **A** | `yclients` | `91.207.75.72` | 300–3600 |

Итог: `yclients.antonbutov.com` → `91.207.75.72`

Проверка после propagation (5–60 мин):

```bash
dig +short yclients.antonbutov.com
# должно вернуть: 91.207.75.72
```

> Опечатка `ycliend.antonbutov.com` редиректится на `yclients.antonbutov.com`.

## GitHub Secrets

Репозиторий: **YourClients/landing** → Settings → Secrets and variables → Actions

| Secret | Обязательно | Описание |
|--------|-------------|----------|
| `DEPLOY_SSH_PRIVATE_KEY` | да | Приватный SSH-ключ (ed25519), публичная часть в `~/.ssh/authorized_keys` на сервере |
| `DEPLOY_USER` | да | SSH-пользователь на сервере, обычно `root` |
| `CERTBOT_EMAIL` | нет | Email для Let's Encrypt (по умолчанию `mail@antonbutov.com`) |

### Как создать ключ для деплоя (если ещё нет)

На своём компьютере:

```bash
ssh-keygen -t ed25519 -C "github-actions-yclients-landing" -f deploy_yclients_ed25519 -N ""
```

На сервере (`91.207.75.72`):

```bash
cat deploy_yclients_ed25519.pub >> ~/.ssh/authorized_keys
```

В GitHub → Secret `DEPLOY_SSH_PRIVATE_KEY` — **полное содержимое** файла `deploy_yclients_ed25519` (включая `BEGIN` / `END`).

Если уже деплоите **lite.masterdoc.pro** с того же сервера — можно **переиспользовать** те же `DEPLOY_SSH_PRIVATE_KEY` и `DEPLOY_USER`.

## CI/CD

Push в `main` → GitHub Actions:

1. Проверка файлов лендинга  
2. `rsync` в `/var/www/yclients.antonbutov.com`  
3. Установка nginx + certbot (при первом деплое, после настройки DNS)

Ручной запуск: Actions → **CI** → **Run workflow**.

## Локальная разработка

```bash
python3 -m http.server 8765
# http://localhost:8765
```

## Форма заявок

Formspree: `https://formspree.io/f/xreveddq`
