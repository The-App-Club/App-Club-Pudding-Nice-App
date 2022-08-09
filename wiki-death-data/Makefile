PHONY: clean reproduce copy-data pudding

clean:
	rm -rf output
	mkdir output

reproduce:
	npm run reproduce

copy-data:
	cp explore-data/*.csv src/data
	cp explore-data/*.csv react-app/public/data

pudding:
	make clean
	make reproduce
	make copy-data
