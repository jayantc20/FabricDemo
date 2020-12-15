# FabricDemo

Hyperledger Fabric Demo v1.4.4 with Fabric Node Sdk v1.4

Please make sure to install all the Pre-requisite

Docker
Docker Compose
Golang
Nodejs
NPM

To Start the network..

```
./start-node.sh
```

Now we need to install chaincode and setup channel..

```
docker pull hyperledger/fabric-ccenv:1.4
docker tag hyperledger/fabric-ccenv:1.4 hyperledger/fabric-ccenv:latest
```

Start CLI conatiner..
```
docker exec -it cli.org0.example.com bash
```

Install Chaincode..
```
export CORE_PEER_ADDRESS=peer0.org0.example.com:7051
peer chaincode install -n demo -v 1.0 -p demo -l golang
```


Create Channel..

1. peer channel create -o orderer0.example.com:7050 -c demo -f /etc/hyperledger/artifacts/channel/demo.tx --tls --cafile /etc/hyperledger/artifacts/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

Join Channel ..

```
export CORE_PEER_ADDRESS=peer0.org0.example.com:7051
peer channel join -b demo.block
```

Instantiate Chaincode .. 

```
peer chaincode instantiate -n demo -v 1.0 -c '{"Args":["init"]}' -o orderer0.example.com:7050 -C demo --tls --cafile /etc/hyperledger/artifacts/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
```

To Stop the network..

```
./stop-node.sh
```

Useful Docker Commands

```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker volume prune
```
