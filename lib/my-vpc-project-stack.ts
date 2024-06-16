import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MyVpcProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCを作成
    const vpc = new ec2.CfnVPC(this, 'MyVpc', {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: [{ key: 'Name', value: 'MyVpc' }]
    });

    // インターネットゲートウェイを作成
    const igw = new ec2.CfnInternetGateway(this, 'InternetGateway', {
      tags: [{ key: 'Name', value: 'MyInternetGateway' }]
    });

    // VPCにインターネットゲートウェイをアタッチ
    new ec2.CfnVPCGatewayAttachment(this, 'VpcGatewayAttachment', {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref
    });

    // パブリックサブネットを作成
    const publicSubnet = new ec2.CfnSubnet(this, 'PublicSubnet', {
      vpcId: vpc.ref,
      cidrBlock: "10.0.1.0/24",
      availabilityZone: cdk.Stack.of(this).availabilityZones[0],
      mapPublicIpOnLaunch: true,
      tags: [{ key: 'Name', value: 'PublicSubnet' }]
    });

    // プライベートサブネットを作成
    const privateSubnet = new ec2.CfnSubnet(this, 'PrivateSubnet', {
      vpcId: vpc.ref,
      cidrBlock: "10.0.2.0/24",
      availabilityZone: cdk.Stack.of(this).availabilityZones[0],
      tags: [{ key: 'Name', value: 'PrivateSubnet' }]
    });

    // 出力: VPC ID
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.ref });
    // 出力: パブリックサブネットID
    new cdk.CfnOutput(this, 'PublicSubnetId', { value: publicSubnet.ref });
    // 出力: プライベートサブネットID
    new cdk.CfnOutput(this, 'PrivateSubnetId', { value: privateSubnet.ref });
  }
}
