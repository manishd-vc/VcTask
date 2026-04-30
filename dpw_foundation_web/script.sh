git pull
npm run build
pm2 delete web
pm2 start npx --name "web" -- next -p 3000
