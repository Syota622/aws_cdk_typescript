import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

interface MyEc2StackProps extends cdk.StackProps {
  publicSubnetId: string;
}

export class MyEc2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyEc2StackProps) {
    super(scope, id, props);

    const projectName = 'cdk';
    const envName = 'prod';

    // SSM用のIAMロールを作成
    const role = new iam.Role(this, `${projectName}-ec2-role-${envName}`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    // EC2インスタンスを作成 (L1リソース)
    const instance = new ec2.CfnInstance(this, `${projectName}-instance-${envName}`, {
      instanceType: 't3.micro',
      imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
      iamInstanceProfile: role.roleName,
      subnetId: props.publicSubnetId, // 取得したパブリックサブネットIDを使用
      keyName: 'my-key-pair' // 既存のキーペア名を指定
    });

    // 出力: EC2インスタンスID
    new cdk.CfnOutput(this, `${projectName}-instance-id-${envName}`, { value: instance.ref });
  }
}
