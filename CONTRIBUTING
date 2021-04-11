# How to add new icons

You can add new icons in `static/icons`. The folders are organized in `license/category/author`
Note that only svg files will be accepted, those files need to be stripped of uneccesary markup. 
scg files should have doctype declared, no width/height set and viewBox set. 

You can use [svgo](https://github.com/svg/svgo) and [svgo-viewbox](https://github.com/scriptex/svgo-viewbox) to clean your vector files and adding viewBox attributes before adding them to the repo. 

To add new icons then clone the repo, add your svg files to the static/icons/*/* directory and follow instructions below. 

If all this suceeds you can go ahead and submit your pull request.

## Build Setup

```bash
# refresh icon index
cd static/icons
python index.py

cd ../../
# Build webapp
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```
You should now see your icons in the browser when you go to `localhost:3000` and search for the name of the icon.

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
