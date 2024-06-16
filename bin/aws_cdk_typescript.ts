#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyVpcProjectStack } from '../lib/my-vpc-project-stack';
import { MyS3BucketStack } from '../lib/my-s3-bucket-stack';

const app = new cdk.App();
new MyVpcProjectStack(app, 'MyVpcProjectStack');
new MyS3BucketStack(app, 'MyS3BucketStack');
