# FabricDemo

Hyperledger Fabric Demo v1.4 with Fabric Node Sdk v1.4

To Start the network..

1. ./start-node.sh

Now we need to install chaincode and setup channel..

1. docker pull hyperledger/fabric-ccenv:1.4
2. docker tag hyperledger/fabric-ccenv:1.4 hyperledger/fabric-ccenv:latest

Start CLI conatiner..

1. docker exec -it cli.org0.example.com bash

Install Chaincode..
1. export CORE_PEER_ADDRESS=peer0.org0.example.com:7051
2. peer chaincode install -n demo -v 1.0 -p demo -l golang

Create Channel..

1. peer channel create -o orderer0.example.com:7050 -c demo -f /etc/hyperledger/artifacts/channel/demo.tx --tls --cafile /etc/hyperledger/artifacts/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

Join Channel ..

1. export CORE_PEER_ADDRESS=peer0.org0.example.com:7051
2. peer channel join -b demo.block

Instantiate Chaincode .. 

1. peer chaincode instantiate -n demo -v 1.0 -c '{"Args":["init"]}' -o orderer0.example.com:7050 -C demo --tls --cafile /etc/hyperledger/artifacts/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

To Stop the network..

1. ./stop-node.sh

Useful Docker Commands
1. docker stop $(docker ps -a -q)
2. docker rm $(docker ps -a -q)
3. docker volume prune
