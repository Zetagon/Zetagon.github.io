var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: [
        "bin/**/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
}
