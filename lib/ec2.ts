import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface MyEc2StackProps extends cdk.StackProps {
  vpcId: string;
}

export class MyEc2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyEc2StackProps) {
    super(scope, id, props);

    const projectName = 'cdk';
    const envName = 'prod';

    // VPCの取得
    const vpc = ec2.Vpc.fromVpcAttributes(this, `${projectName}-vpc-${envName}`, {
      vpcId: props.vpcId,
      availabilityZones: cdk.Stack.of(this).availabilityZones
    });

    // EC2インスタンスを作成 (L1リソース)
    const instance = new ec2.CfnInstance(this, `${projectName}-instance-${envName}`, {
      instanceType: 't2.micro',
      imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
      subnetId: vpc.publicSubnets[0].subnetId,
      keyName: 'my-key-pair' // 既存のキーペア名を指定
    });

    // 出力: EC2インスタンスID
    new cdk.CfnOutput(this, `${projectName}-instance-id-${envName}`, { value: instance.ref });
  }
}
