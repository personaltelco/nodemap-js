.PHONY: build upload

build:
	cp src/app.js build/
	cp index.html style.css build/
tsc: 
	npm run tsc
upload:
	rsync -av ./build/ commons:donp.org/ptp-map
