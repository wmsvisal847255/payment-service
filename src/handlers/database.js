'use strict';

const AWS = require('aws-sdk');
let dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const ORDER_TABLE_NAME = process.env.ORDER_TABLE_NAME;

module.exports.initializateDynamoClient = newDynamo => {
	dynamoDB = newDynamo;
};

module.exports.savePayment = payment => {
	const params = {
		TableName: TABLE_NAME,
		Item: payment
	};

	return dynamoDB
		.put(params)
		.promise()
		.then(() => {
			return payment.paymentId;
		});
};

module.exports.deletePayment = paymentId => {
	const params = {
		Key: {
			paymentId: paymentId
		},
		TableName: TABLE_NAME
	};

	return dynamoDB.delete(params).promise();
};

module.exports.getPayment = paymentId => {
	const params = {
		Key: {
			paymentId: paymentId
		},
		TableName: TABLE_NAME
	};

	return dynamoDB
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
};

module.exports.updateOrder = (orderId, paramsName, paramsValue) => {
	const params = {
		TableName: ORDER_TABLE_NAME,
		Key: {
			orderId
		},
		ConditionExpression: 'attribute_exists(orderId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamoDB
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};

module.exports.updatePayment = (paymentId, paramsName, paramsValue) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			paymentId
		},
		ConditionExpression: 'attribute_exists(paymentId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamoDB
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};