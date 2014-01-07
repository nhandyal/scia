REPORTER=dot

mtest:
	@NODE_ENV=mtest ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \

mtest-w:
	@NODE_ENV=mtest ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--growl \
	--watch

.PHONY: mtest mtest-w
