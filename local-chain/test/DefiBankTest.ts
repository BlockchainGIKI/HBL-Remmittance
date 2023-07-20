import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BankOwner", function () {
  async function defiBankFixture() {
    const tokenName = "10XToken";
    const symbol = "10X";
    const decimals = 0;

    const [bankOwner, Account1, Account2] = await ethers.getSigners();

    const DefiBank = await ethers.getContractFactory("DefiBank");
    const defiBank = await DefiBank.deploy(tokenName, symbol, decimals);

    await defiBank.deployed();

    return {
      defiBank,
      bankOwner,
      Account1,
      Account2,
      tokenName,
      symbol,
      decimals,
    };
  }

  describe("Deployment", function () {
    it("Should set the data of token", async function () {
      // Given
      const { defiBank, tokenName, symbol, decimals } = await loadFixture(
        defiBankFixture
      );
      // Then
      expect(await defiBank.name()).to.equal(tokenName);
      expect(await defiBank.symbol()).to.equal(symbol);
      expect(await defiBank.decimals()).to.equal(decimals);
    });

    it("Should set the right owner", async function () {
      const { defiBank, bankOwner } = await loadFixture(defiBankFixture);

      expect(await defiBank.getBankOwner()).to.equal(bankOwner.address);
    });
  });

  describe("Create Account", function () {
    it("Should createAccount with accountName", async function () {
      // Given
      const { defiBank, Account1 } = await loadFixture(defiBankFixture);
      const accountName = "TestAccount";
      // When
      await defiBank.connect(Account1).createAccount(accountName);
      // Then
      const res = await defiBank.getBankAccountsListByOwner(Account1.address);
      expect(res[0].name).to.equal(accountName);
      expect(res[0].balances).to.equal(0);
    });

    it("Shouldn't createAccount when accountName isDuplicate", async function () {
      // Given
      const { defiBank, Account1, Account2 } = await loadFixture(
        defiBankFixture
      );
      const accountName = "TestAccount";
      // When
      await defiBank.connect(Account1).createAccount(accountName);
      // Then
      await expect(
        defiBank.connect(Account2).createAccount(accountName)
      ).to.be.revertedWith("This account name already use!!");
    });
  });

  describe("Deposit", function () {
    describe("Validations", function () {
      it("Should increase balance of ownerWallet/accountNumber by amount", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const amount = 500;
        // When
        await defiBank.connect(Account1).createAccount(accountName);
        await defiBank.connect(Account1).deposit(accountName, amount);
        // Then
        expect(await defiBank.accountBalance(accountName)).to.equal(amount);
        expect(await defiBank.balanceOf(Account1.address)).to.equal(amount);
      });

      it("Should revert when account is not created", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const amount = 500;

        // Then
        await expect(
          defiBank.connect(Account1).deposit(accountName, amount)
        ).to.be.revertedWith("This account not found");
      });
    });

    describe("Events", function () {
      it("Should emit an event on Deposit", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const amount = 500;
        // When
        await defiBank.connect(Account1).createAccount(accountName);
        // Then
        await expect(defiBank.connect(Account1).deposit(accountName, amount))
          .to.emit(defiBank, "Deposit")
          .withArgs(accountName, amount);
      });
    });
  });

  describe("Withdraw", function () {
    describe("Validations", function () {
      it("Should decrease balance of ownerWallet/accountNumber by amount", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const amount = 500;
        const withdrawAmount = 250;
        await defiBank.connect(Account1).createAccount(accountName);
        await defiBank.connect(Account1).deposit(accountName, amount);
        // When
        await defiBank.connect(Account1).withdraw(accountName, withdrawAmount);
        // Then
        expect(await defiBank.accountBalance(accountName)).to.equal(
          amount - withdrawAmount
        );
        expect(await defiBank.balanceOf(Account1.address)).to.equal(
          amount - withdrawAmount
        );
      });

      it("Should revert when account is not created", async function () {
        // Given
        const { defiBank } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const amount = 500;

        // Then
        await expect(defiBank.withdraw(accountName, amount)).to.be.revertedWith(
          "This account not found"
        );
      });

      it("Should revert when caller is not owner", async function () {
        // Given
        const { defiBank, Account1, Account2 } = await loadFixture(
          defiBankFixture
        );
        const accountName = "TestAccount";
        const amount = 500;
        const withdrawAmount = 250;
        await defiBank.connect(Account1).createAccount(accountName);
        await defiBank.connect(Account1).deposit(accountName, amount);

        // Then
        await expect(
          defiBank.connect(Account2).withdraw(accountName, withdrawAmount)
        ).to.be.revertedWith("You are not account owner");
      });

      it("Should revert when withdrawAmount > balance", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const balance = 500;
        const withdrawAmount = 501;
        await defiBank.connect(Account1).createAccount(accountName);
        await defiBank.connect(Account1).deposit(accountName, balance);

        // Then
        await expect(
          defiBank.connect(Account1).withdraw(accountName, withdrawAmount)
        ).to.be.revertedWith("Your balance is not enough to withdraw");
      });
    });

    describe("Events", function () {
      it("Should emit an event on Withdraw", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const accountName = "TestAccount";
        const amount = 500;
        const withdrawAmount = 250;
        await defiBank.connect(Account1).createAccount(accountName);
        await defiBank.connect(Account1).deposit(accountName, amount);

        // Then
        await expect(
          defiBank.connect(Account1).withdraw(accountName, withdrawAmount)
        )
          .to.emit(defiBank, "Withdraw")
          .withArgs(accountName, withdrawAmount);
      });
    });
  });

  describe("Transfer", function () {
    describe("Validations", function () {
      it(`Should decrease sender ownerWallet/accountNumber balance 
          and increase reciver ownerWallet/accountNumber balance
          if it's sameOwner by amount`, async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const sender = "Sender";
        const reciver = "Revicer";
        const amount = 500;
        const transferAmount = 250;
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account1).createAccount(reciver);
        await defiBank.connect(Account1).deposit(sender, amount);
        // When
        await defiBank
          .connect(Account1)
          .transfer(sender, reciver, transferAmount);
        // Then
        expect(await defiBank.accountBalance(sender)).to.equal(
          amount - transferAmount
        );
        expect(await defiBank.accountBalance(reciver)).to.equal(transferAmount);
        expect(await defiBank.balanceOf(Account1.address)).to.equal(amount);
      });

      it(`Should decrease sender ownerWallet/accountNumber balance 
          and increase reciver ownerWallet/accountNumber balance
          if it's not sameOwner by amount - 1% of fee`, async function () {
        // Given
        const { defiBank, Account1, Account2 } = await loadFixture(
          defiBankFixture
        );
        const sender = "Sender";
        const reciver = "Revicer";
        const amount = 500;
        const transferAmount = 270;
        const fee = Math.floor(transferAmount / 100);
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account2).createAccount(reciver);
        await defiBank.connect(Account1).deposit(sender, amount);
        // When
        await defiBank
          .connect(Account1)
          .transfer(sender, reciver, transferAmount);
        // Then
        expect(await defiBank.accountBalance(sender)).to.equal(
          amount - transferAmount
        );
        expect(await defiBank.accountBalance(reciver)).to.equal(
          transferAmount - fee
        );
        expect(await defiBank.balanceOf(Account1.address)).to.equal(
          amount - transferAmount
        );
        expect(await defiBank.balanceOf(Account2.address)).to.equal(
          transferAmount - fee
        );
      });

      it("Should revert when sender is not created", async function () {
        // Given
        const { defiBank } = await loadFixture(defiBankFixture);
        const sender = "Sender";
        const reciver = "Revicer";
        const transferAmount = 270;

        // Then
        await expect(
          defiBank.transfer(sender, reciver, transferAmount)
        ).to.be.revertedWith("This sender account not found");
      });

      it("Should revert when caller is not owner", async function () {
        // Given
        const { defiBank, Account1, Account2 } = await loadFixture(
          defiBankFixture
        );
        const sender = "Sender";
        const reciver = "Revicer";
        const amount = 500;
        const transferAmount = 250;
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account1).deposit(sender, amount);

        // Then
        await expect(
          defiBank.connect(Account2).transfer(sender, reciver, transferAmount)
        ).to.be.revertedWith("You are not account owner");
      });

      it("Should revert when transferAmount > balance", async function () {
        // Given
        const { defiBank, Account1, Account2 } = await loadFixture(
          defiBankFixture
        );
        const sender = "Sender";
        const reciver = "Revicer";
        const amount = 500;
        const transferAmount = 501;
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account1).deposit(sender, amount);

        // Then
        await expect(
          defiBank.connect(Account1).transfer(sender, reciver, transferAmount)
        ).to.be.revertedWith("Your balance is not enough to transfer");
      });

      it("Should revert when reciver is not created", async function () {
        // Given
        const { defiBank, Account1, Account2 } = await loadFixture(
          defiBankFixture
        );
        const sender = "Sender";
        const reciver = "Revicer";
        const amount = 500;
        const transferAmount = 250;
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account1).deposit(sender, amount);

        // Then
        await expect(
          defiBank.connect(Account1).transfer(sender, reciver, transferAmount)
        ).to.be.revertedWith("This reciver account not found");
      });
    });

    describe("MultipleTranfer", function () {
      it("Should transfer to all accounts if amount is in balances", async function () {
        // Given
        const { defiBank, Account1, Account2 } = await loadFixture(
          defiBankFixture
        );
        const sender = "Sender";
        const reciver1 = "Revicer1";
        const reciver2 = "Revicer2";
        const amount = 500;
        const transferAmount = 100;
        const fee = Math.floor(transferAmount / 100);
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account1).createAccount(reciver1);
        await defiBank.connect(Account2).createAccount(reciver2);
        await defiBank.connect(Account1).deposit(sender, amount);
        // When
        await defiBank
          .connect(Account1)
          .multipleTransfer(sender, [reciver1, reciver2], transferAmount);
        // Then
        expect(await defiBank.accountBalance(sender)).to.equal(
          amount - transferAmount*2
        );
        expect(await defiBank.accountBalance(reciver1)).to.equal(
          transferAmount
        );
        expect(await defiBank.accountBalance(reciver2)).to.equal(
          transferAmount - fee
        );
        expect(await defiBank.balanceOf(Account1.address)).to.equal(
          amount - transferAmount
        );
        expect(await defiBank.balanceOf(Account2.address)).to.equal(
          transferAmount - fee
        );
      });
    });

    describe("Events", function () {
      it("Should emit an event on Transfer", async function () {
        // Given
        const { defiBank, Account1 } = await loadFixture(defiBankFixture);
        const sender = "Sender";
        const reciver = "Revicer";
        const amount = 500;
        const transferAmount = 250;
        await defiBank.connect(Account1).createAccount(sender);
        await defiBank.connect(Account1).createAccount(reciver);
        await defiBank.connect(Account1).deposit(sender, amount);
        // Then
        await expect(
          defiBank.connect(Account1).transfer(sender, reciver, transferAmount)
        )
          .to.emit(defiBank, "Transfer")
          .withArgs(sender, reciver, transferAmount);
      });
    });
  });
});
