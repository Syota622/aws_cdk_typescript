import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class MyS3BucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = 'cdk';
    const envName = 'prod';

    // S3バケットを作成
    const bucket = new s3.CfnBucket(this, `${projectName}-bucket-${envName}`, {
      bucketName: `${projectName}-bucket-${envName}`,
      tags: [{ key: 'Name', value: `${projectName}-bucket-${envName}` }]
    });

    // 出力: S3バケット名
    new cdk.CfnOutput(this, `${projectName}-bucket-name-${envName}`, { value: bucket.ref });
  }
}
