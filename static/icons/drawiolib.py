#!/usr/bin/env python3

""" 
Encodes the whole library into XML files for draw.io as base64 encoded strings.

drawio does not support per icon licenses, we therefore add the license and author info to the title.
"""
import glob
import argparse
import os

# required arg
import json

import base64

from collections import defaultdict
import xml.etree.ElementTree as ET

icons = defaultdict(list)
categories = set()

licenses = {
    "cc-0": {
        "name": "CC0",
        "modules": ["nocopyright"],
        "url": "https://creativecommons.org/publicdomain/zero/1.0/",
    },
    "cc-by-3.0": {
        "name": "CC-BY 3.0 Unported",
        "modules": ["by"],
        "url": "https://creativecommons.org/licenses/by/3.0/",
    },
    "cc-by-4.0": {
        "name": "CC-BY 4.0 Unported",
        "modules": ["by"],
        "url": "https://creativecommons.org/licenses/by/4.0/",
    },
    "cc-by-sa-4.0": {
        "name": "CC-BY SA 4.0",
        "modules": ["by", "sa"],
        "url": "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    "cc-by-sa-3.0": {
        "name": "CC-BY SA 3.0",
        "modules": ["by", "sa"],
        "url": "https://creativecommons.org/licenses/by-sa/3.0/",
    },
    "cc-by-nc-sa-4.0": {
        "name": "CC-BY NC SA 4.0",
        "modules": ["by", "sa", "nc"],
        "url": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    },
    "cc-by-nc-sa-3.0": {
        "name": "CC-BY NC SA 3.0",
        "modules": ["by", "sa", "nc"],
        "url": "https://creativecommons.org/licenses/by-nc-sa/3.0/",
    },
    "cc-by-nc-3.0": {
        "name": "CC-BY NC 3.0",
        "modules": ["by", "nc"],
        "url": "https://creativecommons.org/licenses/by-nc/3.0/",
    },
    "cc-by-nd-3.0": {
        "name": "CC-BY ND 3.0",
        "modules": ["by", "nd"],
        "url": "https://creativecommons.org/licenses/by-nd/3.0/",
    },
    "mit": {
        "name": "MIT",
        "modules": ["retaincopyrightnotice"],
        "url": "https://mit-license.org/",
    },
    "gpl-2": {
        "name": "GPLv2",
        "modules": ["retaincopyrightnotice", "statechanges", "sa"],
        "url": "https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt",
    },
    "asl": {
        "name": "Apache License",
        "modules": ["retaincopyrightnotice", "statechanges"],
        "url": "https://www.apache.org/licenses/LICENSE-2.0.txt",
    },
    "gpl-3": {
        "name": "GPLv3",
        "modules": ["retaincopyrightnotice", "statechanges", "sa"],
        "url": "https://www.gnu.org/licenses/gpl-3.0.txt",
    },
    "bsd": {
        "name": "BSD",
        "modules": ["retaincopyrightnotice", "noendorsement"],
        "url": "https://opensource.org/licenses/BSD-3-Clause",
    },
}


def get_width_height(icon):
    try:
        tree = ET.parse(icon)
        root = tree.getroot()
        viewBox = root.attrib["viewBox"]
        width, height = viewBox.split(" ")[2:]
        return float(width), float(height)
    except KeyError:
        if "height" in root.attrib.keys():
            height = root.attrib["height"]
        else:
            height = 100
        if "width" in root.attrib.keys():
            width = root.attrib["width"]
        else:
            width = 100
        return float(width), float(height)
    except xml.etree.ElementTree.ParseError:
        return float(100), float(100)


# iterates over all svg files organized as license/category/author/icon.svg
for name in glob.glob(os.path.join("./*/*/*/*.svg")):
    n = name.split("/")[-1].split(".")[0]
    l = name.split("/")[1]
    a = name.split("/")[3].replace("_", " ")
    c = name.split("/")[2]

    w, h = get_width_height(name)
    item = {
        "title": f"{n} | {licenses[l]['name']} {a}",
        "data": "data:image/svg+xml;base64,"
        + base64.b64encode(open(name, "rb").read()).decode("utf-8"),
        "w": w,
        "h": h,
        "aspect": "fixed",
    }

    icons[c].append(item)

drawio = {}
for category in icons.keys():
    drawio[category] = {"n":len(icons[category]), "file": "Bioicons-" + category.replace(" ", "_") + ".xml"}
    with open(
        "../drawio-lib/Bioicons-" + category.replace(" ", "_") + ".xml", "w"
    ) as outfile:
        outfile.write("<mxlibrary>" + json.dumps(icons[category]) + "</mxlibrary>")

with open('../drawio-lib/categories.json', 'w') as outfile:
        json.dump(drawio, outfile)