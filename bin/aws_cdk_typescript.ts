#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyVpcProjectStack } from '../lib/vpc';
import { MyS3BucketStack } from '../lib/s3';

const app = new cdk.App();
new MyVpcProjectStack(app, 'MyVpcProjectStack');
new MyS3BucketStack(app, 'MyS3BucketStack');
