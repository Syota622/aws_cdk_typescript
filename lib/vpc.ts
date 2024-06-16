import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MyVpcProjectStack extends cdk.Stack {
  // vpcIdを公開するためのプロパティ
  public readonly vpcId: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = 'cdk';
    const envName = 'prod';

    // VPCを作成
    const vpc = new ec2.CfnVPC(this, `${projectName}-vpc-${envName}`, {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: [{ key: 'Name', value: `${projectName}-vpc-${envName}` }]
    });

    // インターネットゲートウェイを作成
    const igw = new ec2.CfnInternetGateway(this, `${projectName}-internet-gateway-${envName}`, {
      tags: [{ key: 'Name', value: `${projectName}-internet-gateway-${envName}` }]
    });

    // VPCにインターネットゲートウェイをアタッチ
    new ec2.CfnVPCGatewayAttachment(this, `${projectName}-vpc-gateway-attachment-${envName}`, {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref
    });

    // パブリックサブネットを作成
    const publicSubnet = new ec2.CfnSubnet(this, `${projectName}-public-subnet-${envName}`, {
      vpcId: vpc.ref,
      cidrBlock: "10.0.1.0/24",
      availabilityZone: cdk.Stack.of(this).availabilityZones[0],
      mapPublicIpOnLaunch: true,
      tags: [{ key: 'Name', value: `${projectName}-public-subnet-${envName}` }]
    });

    // プライベートサブネットを作成
    const privateSubnet = new ec2.CfnSubnet(this, `${projectName}-private-subnet-${envName}`, {
      vpcId: vpc.ref,
      cidrBlock: "10.0.2.0/24",
      availabilityZone: cdk.Stack.of(this).availabilityZones[0],
      tags: [{ key: 'Name', value: `${projectName}-private-subnet-${envName}` }]
    });

    // パブリックルートテーブルを作成
    const publicRouteTable = new ec2.CfnRouteTable(this, `${projectName}-public-route-table-${envName}`, {
      vpcId: vpc.ref,
      tags: [{ key: 'Name', value: `${projectName}-public-route-table-${envName}` }]
    });

    // プライベートルートテーブルを作成
    const privateRouteTable = new ec2.CfnRouteTable(this, `${projectName}-private-route-table-${envName}`, {
      vpcId: vpc.ref,
      tags: [{ key: 'Name', value: `${projectName}-private-route-table-${envName}` }]
    });

    // パブリックサブネットにルートテーブルを関連付け
    new ec2.CfnSubnetRouteTableAssociation(this, `${projectName}-public-subnet-association-${envName}`, {
      subnetId: publicSubnet.ref,
      routeTableId: publicRouteTable.ref
    });

    // プライベートサブネットにルートテーブルを関連付け
    new ec2.CfnSubnetRouteTableAssociation(this, `${projectName}-private-subnet-association-${envName}`, {
      subnetId: privateSubnet.ref,
      routeTableId: privateRouteTable.ref
    });

    // インターネットゲートウェイへのルートを作成
    new ec2.CfnRoute(this, `${projectName}-public-route-${envName}`, {
      routeTableId: publicRouteTable.ref,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: igw.ref
    });

    // VPC IDの公開
    this.vpcId = vpc.ref;
  }
}
