
all: build

install:
	cd scripts; ./install && ./compile_less

css:
	cd scripts; ./compile_less

build:
	cd scripts/build; ./build

dev:
	cd scripts/build; ./build app development

demo:
	cd scripts/build; ./build demo

feeds:
	cd src/srv/feed/refresh; php refresh_caches.php

docs: doc

doc:
	cd doc; ./make_docs

.PHONY: build demo feeds css install demo doc docs
