#!/bin/bash

node extract.js
grunt prepare_page_data
grunt assemble
grunt buildcontrol:pages
