# AWS CDK TypeScript ポートフォリオ！

# npm install
npm install @aws-cdk/aws-ec2

# cdk コマンド
cdk bootstrap: ブートストラップスタックをデプロイします。
cdk deploy: スタックをデプロイします。
cdk diff: スタックの差分を表示します。

# aws cli
aws ec2 create-key-pair --key-name my-key-pair --query 'KeyMaterial' --output text > my-key-pair.pem
