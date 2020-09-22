const path = require('path')
const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DEV_MODE = process.env.npm_lifecycle_event == 'start'
const fs = require('fs')

const HtmlPlugins = fs.readdirSync('src/templates/nunjucks').map((file) => {
    console.log(file)

    return new HtmlWebpackPlugin({
        filename: file,
        template: path.resolve(__dirname, `src/templates/${file}`),
    })
})

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/js/main.js'),
    },
    output: {
        path: path.resolve('build'),
        filename: '[name].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public'),
                    to: 'public',
                },
            ],
        }),
        ...HtmlPlugins,
        new MiniCssExtractPlugin({
            filename: `[name]${DEV_MODE ? '' : '.min'}.css`,
        }),
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(njk|nunjucks|html)$/,
                loader: 'nunjucks-loader',
                include: [path.resolve(__dirname, 'src/templates/nunjucks')],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve('src'),
                exclude: /(node_modules)/,
                options: {
                    compact: true,
                },
            },
            {
                test: /\.(scss|css)/,
                use: [
                    {
                        loader: DEV_MODE ? 'style-loader' : MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: DEV_MODE,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                            sourceMap: DEV_MODE,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: DEV_MODE,
                        },
                    },
                ],
            },
        ],
    },
}
