import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class VpcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCの作成
    const vpc = new cdk.aws_ec2.CfnVPC(this, 'MyVPC', {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      instanceTenancy: 'default',
      tags: [{ key: 'Name', value: 'My VPC' }],
    });

    // インターネットゲートウェイの作成
    const igw = new cdk.aws_ec2.CfnInternetGateway(this, 'MyIGW', {
      tags: [{ key: 'Name', value: 'My IGW' }],
    });

    // VPCにインターネットゲートウェイをアタッチ
    new cdk.aws_ec2.CfnVPCGatewayAttachment(this, 'MyVPCGatewayAttachment', {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref,
    });

    // パブリックサブネットの作成
    const publicSubnet = new cdk.aws_ec2.CfnSubnet(this, 'MyPublicSubnet', {
      vpcId: vpc.ref,
      availabilityZone: 'ap-northeast-1c',
      cidrBlock: '10.0.1.0/24',
      mapPublicIpOnLaunch: true,
      tags: [{ key: 'Name', value: 'My Public Subnet' }],
    });

    // パブリックルートテーブルの作成
    const publicRouteTable = new cdk.aws_ec2.CfnRouteTable(this, 'MyPublicRouteTable', {
      vpcId: vpc.ref,
      tags: [{ key: 'Name', value: 'My Public Route Table' }],
    });

    // パブリックルートの追加
    new cdk.aws_ec2.CfnRoute(this, 'MyPublicRoute', {
      routeTableId: publicRouteTable.ref,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: igw.ref,
    });

    // サブネットとルートテーブルの関連付け
    new cdk.aws_ec2.CfnSubnetRouteTableAssociation(this, 'MyPublicSubnetRouteTableAssociation', {
      subnetId: publicSubnet.ref,
      routeTableId: publicRouteTable.ref,
    });

    // VPC IDの出力
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.ref,
      description: 'VPC ID',
      exportName: 'MyVpcId',
    });
  }
}