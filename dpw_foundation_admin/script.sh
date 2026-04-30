git pull
npm run build
pm2 delete admin
pm2 start npx --name "admin" -- next -p 3003
#
