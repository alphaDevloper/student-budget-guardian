const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'mjs' and 'cjs' to sourceExts
if (!config.resolver.sourceExts.includes("mjs")) {
  config.resolver.sourceExts.push("mjs");
}
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

// Permanently intercept and resolve lucide-react-native to its CommonJS bundle
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "lucide-react-native") {
    return {
      filePath: path.resolve(
        __dirname,
        "node_modules/lucide-react-native/dist/cjs/lucide-react-native.js"
      ),
      type: "sourceFile",
    };
  }
  if (moduleName.startsWith("lucide-react-native/")) {
    const subpath = moduleName.replace("lucide-react-native/", "");
    return {
      filePath: path.resolve(
        __dirname,
        `node_modules/lucide-react-native/dist/cjs/${subpath}.js`
      ),
      type: "sourceFile",
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativewind(config);


