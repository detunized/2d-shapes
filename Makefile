.PHONY: install run build preview deploy

install:
	npm install

run:
	npx vite

build:
	npx vite build

preview: build
	npx vite preview

deploy: build
	npx wrangler pages deploy dist --project-name 2d-shapes
