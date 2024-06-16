import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MyVpcProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCを作成
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      cidr: "10.0.0.0/16",
      maxAzs: 3,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }
      ],
    });

    // インターネットゲートウェイを作成
    const igw = new ec2.CfnInternetGateway(this, 'InternetGateway', {
      tags: [{ key: 'Name', value: 'MyInternetGateway' }],
    });

    // VPCにインターネットゲートウェイをアタッチ
    new ec2.CfnVPCGatewayAttachment(this, 'VpcGatewayAttachment', {
      vpcId: vpc.vpcId,
      internetGatewayId: igw.ref,
    });

    // 出力: VPC ID
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
    // 出力: パブリックサブネットID
    vpc.publicSubnets.forEach((subnet, index) => {
      new cdk.CfnOutput(this, `PublicSubnet${index + 1}Id`, { value: subnet.subnetId });
    });
    // 出力: プライベートサブネットID
    vpc.privateSubnets.forEach((subnet, index) => {
      new cdk.CfnOutput(this, `PrivateSubnet${index + 1}Id`, { value: subnet.subnetId });
    });
  }
}
