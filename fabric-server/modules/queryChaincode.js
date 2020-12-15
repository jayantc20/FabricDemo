var util = require('util');
var helper = require('./helper.js');

const logger = helper.getLogger("queryChaincode");

const queryChaincode = async (
  peer,
  channelName,
  chaincodeName,
  args,
  fcn,
  username,
  org_name
) => {
  let client = null;
  let channel = null;
  try {
    // first setup the client for this org
    client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      "Successfully got the fabric client for the organization" + org_name
    );
    channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format(
        "Channel '%s' was not defined in the connection profile",
        channelName
      );
      logger.error(message);
      throw new Error(message);
    }

    // send query
    var request = {
      targets: [peer], //queryByChaincode allows for multiple targets
      chaincodeId: chaincodeName,
      fcn: fcn,
      args: args,
    };
    let response_payloads = await channel.queryByChaincode(request);
    if (response_payloads && typeof response_payloads != "string" && response_payloads[0].toString("utf8") !== "") {
      for (let i = 0; i < response_payloads.length; i++) {
        logger.info(response_payloads[i].toString("utf8"));
      }
      return response_payloads[0].toString("utf8");
    } else {
      logger.error("response_payloads is null");
      return {
        success: false,
        result:
          response_payloads[0].toString("utf8") +
          " or response_payloads is null",
      };
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return { success: false, result: error.toString() };
  } finally {
    if (channel) {
      channel.close();
    }
  }
};
const getBlockByNumber = async (
  peer,
  channelName,
  blockNumber,
  username,
  org_name
) => {
  try {
    // first setup the client for this org
    let client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      'Successfully got the fabric client for the organization "%s"',
      org_name
    );
    let channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format(
        "Channel '%s' was not defined in the connection profile",
        channelName
      );
      logger.error(message);
      throw new Error(message);
    }

    let response_payload = await channel.queryBlock(
      parseInt(blockNumber, peer)
    );
    if (response_payload) {
      logger.debug(response_payload);

      return response_payload;
    } else {
      logger.error("response_payloads is null");
      return { success: false, result: "response_payloads is null" };
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return { success: false, result: error.toString() };
  }
};
const getTransactionByID = async (
  peer,
  channelName,
  trxnID,
  username,
  org_name
) => {
  try {
    // first setup the client for this org
    var client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      "Successfully got the fabric client for the organization '%s'",
      org_name
    );
    var channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format(
        "Channel '%s' was not defined in the connection profile",
        channelName
      );
      logger.error(message);
      throw new Error(message);
    }

    let response_payload = await channel.queryTransaction(trxnID, peer);
    if (response_payload) {
      logger.debug(response_payload);
      return response_payload;
    } else {
      logger.error("response_payloads is null");
      return { success: false, result: "response_payloads is null" };
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return { success: false, result: error.toString() };
  }
};
const getBlockByHash = async (peer, channelName, hash, username, org_name) => {
  try {
    // first setup the client for this org
    var client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      "Successfully got the fabric client for the organization '%s'",
      org_name
    );
    let channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format(
        "Channel '%s' was not defined in the connection profile",
        channelName
      );
      logger.error(message);
      throw new Error(message);
    }

    let response_payload = await channel.queryBlockByHash(
      Buffer.from(hash, "hex"),
      peer
    );
    if (response_payload) {
      logger.debug(response_payload);
      return response_payload;
    } else {
      logger.error("response_payloads is null");
      return { success: false, result: "response_payloads is null" };
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return { success: false, result: error.toString() };
  }
};
const getChainInfo = async (peer, channelName, username, org_name) => {
  try {
    // first setup the client for this org
    let client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      "Successfully got the fabric client for the organization '%s'",
      org_name
    );
    let channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format(
        "Channel '%s' was not defined in the connection profile",
        channelName
      );
      logger.error(message);
      throw new Error(message);
    }

    let response_payload = await channel.queryInfo(peer);
    if (response_payload) {
      logger.debug(response_payload);
      return response_payload;
    } else {
      logger.error("response_payloads is null");
      return { success: false, result: "response_payloads is null" };
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return { success: false, result: error.toString() };
  }
};
//getInstalledChaincodes
const getInstalledChaincodes = async (
  peer,
  channelName,
  type,
  username,
  org_name
) => {
  try {
    // first setup the client for this org
    let client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      "Successfully got the fabric client for the organization '%s'",
      org_name
    );

    let response = null;
    if (type === "installed") {
      response = await client.queryInstalledChaincodes(peer, true); //use the admin identity
    } else {
      let channel = client.getChannel(channelName);
      if (!channel) {
        let message = util.format(
          "Channel '%s' was not defined in the connection profile",
          channelName
        );
        logger.error(message);
        throw new Error(message);
      }
      response = await channel.queryInstantiatedChaincodes(peer, true); //use the admin identity
    }
    if (response) {
      if (type === "installed") {
        logger.debug("Installed Chaincodes");
      } else {
        logger.debug("Instantiated Chaincodes");
      }
      var details = [];
      for (let i = 0; i < response.chaincodes.length; i++) {
        details.push(
          "name: " +
            response.chaincodes[i].name +
            ", version: " +
            response.chaincodes[i].version +
            ", path: " +
            response.chaincodes[i].path
        );
      }
      return details;
    } else {
      logger.error("response is null");
      return "response is null";
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return error.toString();
  }
};
const getChannels = async (peer, username, org_name) => {
  try {
    // first setup the client for this org
    let client = await helper.getClientForOrg(org_name, username);
    logger.debug(
      "Successfully got the fabric client for the organization '%s'",
      org_name
    );

    let response = await client.queryChannels(peer);
    if (response) {
      logger.debug("channels");
      var channelNames = [];
      for (let i = 0; i < response.channels.length; i++) {
        channelNames.push("channel id: " + response.channels[i].channel_id);
      }
      logger.debug(channelNames);
      return response;
    } else {
      logger.error("response_payloads is null");
      return "response_payloads is null";
    }
  } catch (error) {
    logger.error(
      "Failed to query due to error: " + error.stack ? error.stack : error
    );
    return error.toString();
  }
};


exports.queryChaincode = queryChaincode;
exports.getBlockByNumber = getBlockByNumber;
exports.getTransactionByID = getTransactionByID;
exports.getBlockByHash = getBlockByHash;
exports.getChainInfo = getChainInfo;
exports.getInstalledChaincodes = getInstalledChaincodes;
exports.getChannels = getChannels;
