#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc';
import { S3Stack } from '../lib/s3';
import { EC2Stack } from '../lib/ec2';

const app = new cdk.App();
new VpcStack(app, 'MyVpcStack');
new S3Stack(app, 'MyS3Stack');
new EC2Stack(app, 'MyEC2Stack');

app.synth();
