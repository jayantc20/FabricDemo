var async = require("../utils/asyncMiddleware.js");
var invoke = require("../modules/invokeChaincode.js");
var query = require("../modules/queryChaincode.js");
var CryptoJs = require("crypto-js");
// var exif = require('exiftool');

const invokeTransaction = async.asyncMiddleware(async (req, res) => {
  let { peers, fcn, args } = req.body;
  const { chaincodeName, channelName } = req.params;

  peers = JSON.parse(peers);
  args = JSON.parse(args);


  if (!req.files) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
  }

  const doc = req.files.doc;
  //console.log(doc);

  var dochash = CryptoJs.SHA256(doc.data.toString()).toString();
  args[args.length] = dochash;

  var metadata = {
    name : doc.name,
    size : doc.size,
    encoding : doc.encoding,
    tempFilePath : doc.tempFilePath,
    truncated: doc.truncated,
    mimetype : doc.mimetype,
    md5 : doc.md5
  };

  args[args.length] = JSON.stringify(metadata);

  //  exif.metadata(doc.data, function (err, metadata) {
  //   if (err)
  //     throw err;
  //   else
  //     // console.log(metadata);
  //     var res = metadata.reduce((a,b)=> (a,b),{});
  //     console.log(res);
  //     args[args.length] = res;
  // });
  // console.log(args);

 

  const response = await invoke.invokeChaincode(
    peers,
    channelName,
    chaincodeName,
    fcn,
    args,
    req.username,
    req.orgname
  );

  res.json(response);
});

const queryTransaction = async.asyncMiddleware(async (req, res) => {
  let { peer, fcn, args } = req.query;
  const { chaincodeName, channelName } = req.params;

  args = args.replace(/'/g, '"');
  args = JSON.parse(args);

  const response = await query.queryChaincode(
    peer,
    channelName,
    chaincodeName,
    args,
    fcn,
    req.username,
    req.orgname
  );
  try {
    let parseresponse = JSON.parse(response);

    if (Array.isArray(parseresponse)) {
      res.json(parseresponse);
    } else {
      let parsemeta = JSON.parse(parseresponse.metadata);
      let result = {
        hash: parseresponse.hash,
        metadata: parsemeta,
        time : parseresponse.time
      };
      res.json(result);
    }
    res.send(response);
  } catch (error) {
    res.status(404).json(response);
    throw new Error(error);
  }
});

exports.invokeTransaction = invokeTransaction;
exports.queryTransaction = queryTransaction;
