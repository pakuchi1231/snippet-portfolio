# infra-tf/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

# データベース（DynamoDB）の作成
resource "aws_dynamodb_table" "snippets" {
  name           = "terraform-snippets-table"
  billing_mode   = "PAY_PER_REQUEST" # 使った分だけ課金（無料枠内）
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S" # String型
  }

  tags = {
    Name = "SnippetTable-TF"
  }
}

output "table_name" {
  description = "作成されたDynamoDBテーブルの名前"
  value       = aws_dynamodb_table.snippets.name
}

output "table_id" {
  description = "作成されたDynamoDBテーブルのID"
  value       = aws_dynamodb_table.snippets.id
}