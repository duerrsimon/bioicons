#!/usr/bin/env python3

import glob 
import argparse
import os
# required arg
import json
   



icons = []
categories = set() 
# iterates over all svg files organized as license/category/author/icon.svg
for name in glob.glob(os.path.join("./*/*/*/*.svg")):
    n = name.split('/')[-1].split('.')[0]
    l = name.split('/')[1]
    a = name.split('/')[3].replace('_', ' ')
    c = name.split('/')[2]
    item={"name": n,
    "category": c,
    "license":l,
    "author":a
    }
    icons.append(item)
    categories.add(c)

categories = list(categories)

categories.insert(0,'All_icons')

with open('icons.json', 'w') as outfile:
        json.dump(icons, outfile)

with open('categories.json', 'w') as outfile:
        json.dump(categories, outfile)
