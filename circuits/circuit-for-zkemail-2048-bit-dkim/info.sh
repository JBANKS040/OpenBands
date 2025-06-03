#!/bin/bash

# Extract information about the circuit size
bb gates -b target/openbands.json | grep "circuit"