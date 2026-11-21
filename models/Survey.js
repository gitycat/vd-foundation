module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define('Survey', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    headOfHousehold: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalFamilyMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    childrenUnder18: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    casteCategory: {
      type: DataTypes.STRING,
      defaultValue: 'General',
    },
    highestEducation: {
      type: DataTypes.STRING,
      defaultValue: 'Primary',
    },
    schoolGoingChildren: {
      type: DataTypes.STRING,
      defaultValue: 'Yes',
    },
    accessToHealthcare: {
      type: DataTypes.STRING,
      defaultValue: 'Primary Health Centre (PHC)',
    },
    chronicIllnessInFamily: {
      type: DataTypes.STRING,
      defaultValue: 'No',
    },
    primaryIncomeSource: {
      type: DataTypes.STRING,
      defaultValue: 'Agriculture / Farming',
    },
    employmentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'Self-Employed',
    },
    monthlyFamilyIncome: {
      type: DataTypes.STRING,
      defaultValue: 'Below ₹10,000',
    },
    rationCardType: {
      type: DataTypes.STRING,
      defaultValue: 'BPL',
    },
    bankAccountAndUPI: {
      type: DataTypes.STRING,
      defaultValue: 'Yes',
    },
    housingType: {
      type: DataTypes.STRING,
      defaultValue: 'Kutcha',
    },
    waterSource: {
      type: DataTypes.STRING,
      defaultValue: 'Community Tap',
    },
    sanitationFacility: {
      type: DataTypes.STRING,
      defaultValue: 'Household Toilet',
    },
    electricityAccess: {
      type: DataTypes.STRING,
      defaultValue: 'Grid Connected',
    },
    cookingFuelType: {
      type: DataTypes.STRING,
      defaultValue: 'LPG Cylinder',
    },
    roadConnectivity: {
      type: DataTypes.STRING,
      defaultValue: 'Paved / Tar Road',
    },
    ownsAgriculturalLand: {
      type: DataTypes.STRING,
      defaultValue: 'No',
    },
    landAreaInAcres: {
      type: DataTypes.STRING,
      defaultValue: '0',
    },
    irrigationSource: {
      type: DataTypes.STRING,
      defaultValue: 'Rain-fed',
    },
    livestockOwned: {
      type: DataTypes.STRING,
      defaultValue: 'None',
    },
    availedGovtSchemes: {
      type: DataTypes.STRING,
      defaultValue: 'PM-KISAN',
    },
    villagerUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    villagerPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSubmitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editRequested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editRequestStatus: {
      type: DataTypes.STRING,
      defaultValue: 'None',
    },
    editRequestReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    editRequestedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    editRequestedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    adminFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requestHistory: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('requestHistory');
        if (!raw) return [];
        let parsed = raw;
        for (let i = 0; i < 4; i++) {
          if (Array.isArray(parsed)) return parsed;
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              return [];
            }
          } else {
            return [];
          }
        }
        return Array.isArray(parsed) ? parsed : [];
      },
      set(value) {
        let arr = value;
        for (let i = 0; i < 4; i++) {
          if (Array.isArray(arr)) break;
          if (typeof arr === 'string') {
            try {
              arr = JSON.parse(arr);
            } catch {
              arr = [];
              break;
            }
          } else {
            arr = [];
            break;
          }
        }
        this.setDataValue('requestHistory', JSON.stringify(Array.isArray(arr) ? arr : []));
      }
    },
    villageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    volunteerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'surveys',
    timestamps: true,
  });

  return Survey;
};