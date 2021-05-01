#!/bin/bash

shopt -s globstar  # enable the ** glob
shopt -s dotglob   # also let patterns match hidden files

declare -A dirs    # where we store directories for each found name

for pathname in "${1:-.}"/**; do
    [ ! -f "$pathname" ] && continue  # not something we're interested in

    name=${pathname##*/}
    if [ -n "${dirs[$name]}" ]; then
        # we have seen this filename before
        dups+=( "$name" )
    fi

    # append directory name to ':'-delimited list for this filename
    dirs[$name]=${dirs[$name]:+"${dirs[$name]}:"}"${pathname%/*}"
done

# go through the list of duplicates and 
# print the found directory names for each
for name in "${dups[@]}"; do
    printf '%s:\n\t%s\n' "$name" "${dirs[$name]}"
done
