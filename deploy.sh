#!/bin/bash

grunt extract_from_archive
grunt prepare_page_data
grunt assemble
grunt buildcontrol:pages
