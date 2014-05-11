#!/bin/bash

grunt

# Must be run separately for now because of the way options.pages is loaded
grunt assemble

grunt buildcontrol:pages
