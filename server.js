import express from 'express';
import path from 'path';
import serialize from 'serialize-javascript';
import {navigateAction} from 'fluxible-router';
import React from 'react';
import ReactDOM from 'react-dom/server';
import app from './app';
import HtmlComponent from './components/Html';
import { createElementWithContext } from 'fluxible-addons-react';

const server = express();
server.use('/public', express['static'](path.join(__dirname, '/build')));

server.use((req, res, next) => {
    const context = app.createContext();

    context.getActionContext().executeAction(navigateAction, {
        url: req.url
    }, (err) => {
        if (err) {
            if (err.statusCode && err.statusCode === 404) {
                // Pass through to next middleware
                next();
            } else {
                next(err);
            }
            return;
        }

        const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        const markup = ReactDOM.renderToString(createElementWithContext(context));
        const htmlElement = React.createElement(HtmlComponent, {
            context: context.getComponentContext(),
            state: exposed,
            markup: markup
        });
        const html = ReactDOM.renderToStaticMarkup(htmlElement);

        res.type('html');
        res.write('<!DOCTYPE html>' + html);
        res.end();
    });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log('Application listening on port ' + port);

export default server;
