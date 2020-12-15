'use strict';
var log4js = require("log4js");
var path = require("path");
var util = require("util");
var hfc = require("fabric-client");

const logger = log4js.getLogger("helper");
logger.setLevel("DEBUG");
hfc.setLogger(logger);

const getClientForOrg = async (userorg, username) => {
  try {
    logger.debug("getClientForOrg Start- '%s' '%s'",userorg,username);
    let config = "-connection-profile-path";
    let client = hfc.loadFromConfig(hfc.getConfigSetting("network" + config));
    client.loadFromConfig(hfc.getConfigSetting(userorg + config));

    await client.initCredentialStores();

    if (username) {
      let user = await client.getUserContext(username, true);
      if (!user) {
        throw new Error(util.format("User was not found : " + username));
      } else {
        logger.debug(
          "User '%s' was found to be registered and enrolled",
          username
        );
      }
    }
    logger.debug("getClientForOrg End - '%s' '%s'",userorg,username);

    return client;
  } catch (error) {
    logger.error(
      "Failed to get registered user: '%s' with error: '%s'",
      username,
      error.toString()
    );
    return "failed "+ error.toString();
  }
};

const getRegisteredUser = async (username, userOrg, isJson) => {
  try {
    // Get a fabric client
    var client = await getClientForOrg(userOrg);
    logger.debug("Successfully initialized the credential stores");

    // Check to see if the user is already enrolled
    var user = await client.getUserContext(username, true);
    if (user && user.isEnrolled()) {
      logger.info("Successfully loaded member from persistence");
    } else 
    {
      // user was not enrolled, so we will need an admin user object to register
      logger.info(
        "User '%s' was not enrolled, so we will need an admin user object to register",
        username
      );
      var admins = hfc.getConfigSetting("admins");
      let adminUserObj = await client.setUserContext({
        username: admins[0].username,
        password: admins[0].secret,
      });
      if (adminUserObj.getAffiliation() != userOrg.toLowerCase()) {
        logger.info("Admin affiliation not registered. Registering now.");
        adminUserObj.setAffiliation(userOrg.toLowerCase());
        adminUserObj.setRoles(["peer", "orderer", "client", "user"]);
        adminUserObj = await client.setUserContext(adminUserObj);
      }
      logger.info("Admin User: '%s'",adminUserObj);

      // Register and enroll the user
      let caClient = client.getCertificateAuthority();
      let affiliation = userOrg.toLowerCase() + ".department1";
      // Check if organization exists
      const affiliationService = caClient.newAffiliationService();
      const registeredAffiliations = await affiliationService.getAll(
        adminUserObj
      );
      if (
        !registeredAffiliations.result.affiliations.some(
          (x) => x.name == userOrg.toLowerCase()
        )
      ) {
        logger.info("Register the new affiliation: '%s'",affiliation);
        await affiliationService.create(
          { name: affiliation, force: true },
          adminUserObj
        );
      }

      let secret = await caClient.register(
        {
          enrollmentID: username,
          enrollmentSecret: null,
          role: "client",
          affiliation,
        },
        adminUserObj
      );
      logger.debug(
        "Successfully got the secret for user '%s' - '%s'",
        username,
        secret
      );

      user = await client.setUserContext({
        username: username,
        password: secret,
      });
      user.setAffiliation(affiliation);
      user.setRoles(["client"]);
      user._enrollmentSecret = secret.toString();
      user = await client.setUserContext(user);
      logger.info(
        "Successfully enrolled username and setUserContext on the client object: '%s'",
        user
      );
    }
    if (user && user.isEnrolled) {
      if (isJson && isJson === true) {
        var response = {
          success: true,
          secret: user._enrollmentSecret,
          message: username + " enrolled Successfully",
        };
        return response;
      }
    } else {
      throw new Error("User was not enrolled");
    }
  } catch (error) {
    logger.error(
      "Failed to get registered user: '%s' with error: '%s'",
      username,
      error.toString()
    );
    return "failed '%s'",error.toString();
  }
};

const setupChaincodeDeploy = () => {
  process.env.GOPATH = path.join(
    __dirname,
    hfc.getConfigSetting("CC_SRC_PATH")
  );
};

const getLogger = (moduleName) => {
  var logger = log4js.getLogger(moduleName);
  logger.setLevel("DEBUG");
  return logger;
};

exports.getClientForOrg = getClientForOrg;
exports.getLogger = getLogger;
exports.setupChaincodeDeploy = setupChaincodeDeploy;
exports.getRegisteredUser = getRegisteredUser;
