#/bin/bash

git config --global user.email "chris@geihsler.net"
git config --global user.name "Collective Archive (via Travis CI)"
cp -f .travis/deploy_key.pem ~/.ssh/id_rsa
cp -f .travis/ssh-config ~/.ssh/config
chmod 0600 ~/.ssh/id_rsa
