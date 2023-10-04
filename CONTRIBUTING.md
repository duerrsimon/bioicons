# Contributing

## How to add new icons (via Web)

The easiest way to contribute illustrations is via web form under [bioicons.com/submit](https://bioicons.com/submit/). 

All illustrations will be checked by the main developer Simon. If you want become a maintainer and be involved in icon curation please open an issue in the repository or contact Simon. 

Our standards for submitting illustrations are: 

- vector only in SVG format
- avoid inline styles or bitmap textures in the SVG file and iff possible process them using [svgo](https://github.com/svg/svgo) and [svgo-viewbox](https://github.com/scriptex/svgo-viewbox) to clean your vector files
- respect our code of conduct and make sure your illustrations are scientifically accurate. 
  In particular we want to avoid stereotypical depictions (for example images with only white men doing science or women in high heels in the lab)
- You certify you own the copyright or have properly specified the license and the original author
- Illustrations should have a certain degree of complexity (not just a few spheres and some text).
- Illustrations should mostly be single building blocks and not full figures (i.e an icon of the corona virus particle but not the complete life cycle of the virus). We invite you to split such illustrations into their individual components. 

For all illustrations submitted via the Webform a Pull Request on GitHub will be created and you can track progress of your submission there ([github.com/duerrsimon/bioicons/pulls](https://github.com/duerrsimon/bioicons/pulls)).
We might have questions or suggestions for categorization, naming or general design of your illustration so it is advisable if you provide a GitHub username.

  

## How to add new icons (via Pull Request)

You can add new icons in `static/icons`. The folders are organized in `license/category/author`
Note that only svg files will be accepted, those files need to be stripped of uneccesary markup. 
svg files should have doctype declared, no width/height set and viewBox set. 

You can use [svgo](https://github.com/svg/svgo) and [svgo-viewbox](https://github.com/scriptex/svgo-viewbox) to clean your vector files and adding viewBox attributes before adding them to the repo. 

To add new icons it is easiest if you use [github.dev](github.dev/duerrsimon/bioicons). 

After opening the repo using the github.dev link, you can upload icons in the sidebar in `static/icons/*/*` and modify `static/authors.json` to include your name (same as `author` folder name used, replace spaces with underscore). You can link e.g your personal website, your ORCID profile etc in the json file.

Then submit your pull request.


The below steps are needed only for code modifications. 
## Build Setup (local)

```bash
# refresh icon index
cd static/icons
python index.py

Add yourself to the authors file using the same alias as for the folder name. You can link e.g your personal website, your ORCID profile etc. 
Do not use spaces but replace spaces with underscores. 

`static/icons/authors.json`


cd ../../
# Build webapp
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```
You should now see your icons in the browser when you go to `localhost:3000` and search for the name of the icon.

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
