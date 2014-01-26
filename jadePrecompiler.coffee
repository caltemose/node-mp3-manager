fs = require "fs"
jade = require "jade"
async = require "async"

# done callback will be passed (source, err)
exports.compile = (done, templatesDir) ->
  js = "var Templates = {}; \n\n"
  templatesDir = "./views/client-templates/"
  # get all files in templates directory
  fs.readdir templatesDir, (err, files) ->
    # keep only ".jade" files
    jadeFiles = files.filter (file) -> 
      file.substr(-5) == ".jade"

    # function to compile jade templates (appending to js source)
    compileTmpl = (file, doneCompile) ->
      # "test.jade" becomes "test"
      key = file.substr(0, file.indexOf("."))
      filePath = templatesDir + file
      fs.readFile filePath, (err, src) ->
        # store js function source into Templates.{key}
        js += "Templates." + key + " = " + jade.compileClient(src, { debug: false }).toString() + "; \n\n"
        doneCompile(err)

    # foreach jadeFile, compile template, then write templates.js file
    async.forEach jadeFiles, compileTmpl, (err) ->
      console.log "Browser jade templates compiled."
      console.log ""
      done(js, err)
