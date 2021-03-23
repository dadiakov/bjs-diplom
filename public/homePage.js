'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout(response => {
    response.success && location.reload();
  });
};

ApiConnector.current( response => {
    response.success && ProfileWidget.showProfile(response.data);
});

const ratesBoard = new RatesBoard();
function getCurrentVault() {
    ApiConnector.getStocks(response => {
        response.success && ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    });
};
getCurrentVault();
setInterval(getCurrentVault, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        response.success && ProfileWidget.showProfile(response.data);
        if (response.success) { 
            moneyManager.setMessage(response.success, 'Пополнение прошло успешно!');
        } else {
            moneyManager.setMessage(response.success, 'Пополнение не прошло');
        }

    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        response.success && ProfileWidget.showProfile(response.data);
        if (response.success) { 
            moneyManager.setMessage(response.success, 'Конвертация прошла успешно!');
        } else {
            moneyManager.setMessage(response.success, 'Конвертация не прошла');
        }
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        response.success && ProfileWidget.showProfile(response.data);
        if (response.success) { 
            moneyManager.setMessage(response.success, 'Перевод прошел успешно!');
        } else {
            moneyManager.setMessage(response.success, 'Перевод совершить не удалось');
        }
    });
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    response.success && favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Добавление прошло успешно!');
        } else {
            favoritesWidget.setMessage(response.success, 'Добавить не получилось(((');
        }
    });
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Удаление прошло успешно!');
        } else {
            favoritesWidget.setMessage(response.success, 'Упс... Что-то пошло не так...');
        }
    });
}