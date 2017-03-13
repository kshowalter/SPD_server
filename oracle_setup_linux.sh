#! /usr/bin/env bash
# execute the script in the context of the calling shell
# . ./path/script.sh


# Oracle instant client
# http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html
# Download the basic client, and the SDK

# Addtional install instructions
# https://github.com/oracle/node-oracledb/blob/master/INSTALL.md

# install the nodejs module
# https://www.npmjs.com/package/oracledb


export LD_LIBRARY_PATH="/opt/oracle/instantclient:$LD_LIBRARY_PAT"
export OCI_LIB_DIR="/opt/oracle/instantclient"
export OCI_INC_DIR="/opt/oracle/instantclient/sdk/include"
