 ![](https://raw.githubusercontent.com/dapaas/grafterizer/master/app/apple-touch-icon.png)
 
Grafterizer
===========

Graphical user interface for defining Grafter-based data transformation pipelines in DaPaaS.

### Development

This branch uses the [Yeoman](http://yeoman.io/) development workflow.

First, you need [Node.js](http://nodejs.org/).

Then, install grunt, bower and yeoman:
```npm install -g grunt-cli bower yo generator-angular```

Install the development dependencies:
```npm install```

Install the application dependencies:
```bower install```

Start the development server:
```grunt serve```

### How to build

Execute ```grunt build``` to build the application. The dist folder will then be filled with the compiled files.

You can optionnaly build a [Docker](http://docker.com/) image.
```docker build -t grafterizer .```

### Deployment

You can deploy a Grafterizer instance using [Docker Compose](https://docs.docker.com/compose/). The application starts a HTTP server on the port 80 by default.

```sh
wget "https://raw.githubusercontent.com/dapaas/grafterizer/master/docker-compose.yml"
docker-compose up
```

## Questions or issues?

For posting information about bugs, questions and discussions please use the [Github Issues](https://github.com/datagraft/grafterizer/issues) feature.

## Core Team

- [Nikolay Nikolov](https://github.com/nvnikolov) (main contact person)
- [Antoine Pultier](https://github.com/yellowiscool)
- [Dina Sukhobok](https://github.com/dinans)
- [Håvard Heitlo Holm](https://github.com/havahol)
- [Ana Tarita](https://github.com/taritaAna)

## License

Available under the [Eclipse Public License](/LICENSE) (v1.0).
