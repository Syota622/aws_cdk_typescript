#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyVpcProjectStack } from '../lib/vpc';
import { MyS3BucketStack } from '../lib/s3';
import { MyEc2Stack } from '../lib/ec2';

const app = new cdk.App();

const vpcStack = new MyVpcProjectStack(app, 'MyVpcProjectStack');
new MyS3BucketStack(app, 'MyS3BucketStack');
new MyEc2Stack(app, 'MyEc2Stack', {
  // vpcId: vpcStack.vpcId,
  publicSubnetId: vpcStack.publicSubnetId
  // privateSubnetId: vpcStack.privateSubnetId
});
