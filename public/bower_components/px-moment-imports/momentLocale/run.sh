#!/bin/bash
for file in ./*;
do



    	test=${file##*/}
      short=${test%%.html}
    	#mv "${test}" "${short}.json"
      echo "* - ${short}" >> list.txt

done
