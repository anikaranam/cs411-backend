#!/usr/bin/env python
# coding: utf-8

# In[1]:


# import modules
import numpy as np 
import sys
from scipy import linalg
import mysql.connector
import matplotlib.pyplot as plt
from PIL import Image


# In[2]:


try:
    connection = mysql.connector.connect(host='localhost',
                                         database='mydb',
                                         user='root',
                                         password='nbavision')
    cursor = connection.cursor()
    cursor.callproc('GetNBAData')
    for result in cursor.stored_results():
        myresult = result.fetchall()

except mysql.connector.Error as error:
    print("Failed to execute stored procedure: {}".format(error))
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
#         print("MySQL connection is closed")
        


# In[3]:


# define helper functions and classes
def count(arr,s):
    total = 0
    for elem in arr:
        if elem == s:
            total += 1
    return total 

def check_arr(arr):
    for i in arr:
        if i == False:
            return False
    return True

class player:
    def __init__(self,name,pe,position):
        self.name = name
        self.pe = pe
        self.position = position


# In[4]:


#train the AI on all 5 positions

# make a and b matrices for all positions
pg_matrix = []
pg_pe = []
sg_matrix = []
sg_pe =[]
c_matrix = []
c_pe = []
pf_matrix = []
pf_pe =[]
sf_matrix = []
sf_pe = []



for row in myresult:
    '''factors: PointsPerGame 0, AssistsPerGame 1, ReboundsPerGame 2, BlocksPerGame 3, StealsPerGame 4,     ThreePointPercentage 5, MinutesPerGame 6, GamesPlayed 7, Height 8, Weight 9,  Position 10,     PlayerEfficiency 11 ''' 

    # else if any row   
    position = row[11]

    if position == "PG":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        pg_matrix.append(row[1:11])
        pg_pe.append(pe)

    if position == "SG":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        sg_matrix.append(row[1:11])
        sg_pe.append(pe)

    if position == "C":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        c_matrix.append(row[1:11])
        c_pe.append(pe)

    if position == "PF":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        pf_matrix.append(row[1:11])
        pf_pe.append(pe)

    if position == "SF":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        sf_matrix.append(row[1:11])
        sf_pe.append(pe)

solution_pg = linalg.lstsq(pg_matrix,pg_pe) [0]
solution_sg = linalg.lstsq(sg_matrix,sg_pe) [0]
solution_c = linalg.lstsq(c_matrix,c_pe) [0]
solution_pf = linalg.lstsq(pf_matrix,pf_pe) [0]
solution_sf = linalg.lstsq(sf_matrix,sf_pe) [0]


# In[5]:



        
def find_all_star_team(conference):
    max_pe_pg = -sys.maxsize
    best_pg = ''
    max_pe_sg = -sys.maxsize
    best_sg = ''
    max_pe_c = -sys.maxsize
    best_c = ''
    max_pe_pf = -sys.maxsize
    best_pf = ''
    max_pe_sf = -sys.maxsize
    best_sf = ''

    skip_list = set()

    finalized = [False,False,False,False,False]

    while( check_arr(finalized)  == False):

        if finalized[0] == False:
            max_pe_pg = -sys.maxsize
            best_pg = ''

        if finalized[1] == False: 
            max_pe_sg = -sys.maxsize
            best_sg = ''

        if finalized[2] == False:
            max_pe_c = -sys.maxsize
            best_c = ''

        if finalized[3] == False:
            max_pe_pf = -sys.maxsize
            best_pf = ''

        if finalized[4] == False:
            max_pe_sf = -sys.maxsize
            best_sf = ''


        first_row = True

        for row in myresult:
            
            #only consider a single conference
            if row[13] != conference:
                continue

            if row[0] in skip_list:
                continue

            factors = row[1:11] 

            new_pe_pg = 0
            new_pe_sg = 0
            new_pe_c = 0
            new_pe_pf = 0
            new_pe_sf = 0


            # dot product
            for i in range(len(factors)):
                new_pe_pg += float(factors[i]) * float(solution_pg[i])
                new_pe_sg += float(factors[i]) * float(solution_sg[i])
                new_pe_c += float(factors[i]) * float(solution_c[i])
                new_pe_pf += float(factors[i]) * float(solution_pf[i])
                new_pe_sf += float(factors[i]) * float(solution_sf[i])

            if new_pe_pg > max_pe_pg and finalized[0] == False:
                best_pg = row[0]
                max_pe_pg = new_pe_pg

            if new_pe_sg > max_pe_sg and finalized[1] == False:
                best_sg = row[0]
                max_pe_sg = new_pe_sg

            if new_pe_c > max_pe_c and finalized[2] == False:
                best_c = row[0]
                max_pe_c = new_pe_c

            if new_pe_pf > max_pe_pf and finalized[3] == False:
                best_pf = row[0]
                max_pe_pf = new_pe_pf

            if new_pe_sf > max_pe_sf and finalized[4] == False:
                best_sf = row[0]
                max_pe_sf = new_pe_sf

        # evaluate no two positions are taken by the same player
        # if they are: keep the player in the higher PE position and redo the algorithm for the other position

        all_star = [best_pg, best_sg, best_c, best_pf, best_sf]
        all_star_rating = [max_pe_pg, max_pe_sg, max_pe_c, max_pe_pf, max_pe_sf]
        Positions = ['Point Guard', 'Shooting Guard', 'Center', 'Power Forward', 'Small Forward']

        for i in range(len(all_star)):

            if count(all_star, all_star[i]) == 1:
                # found best player for that position
                finalized[i] = True
                skip_list.add(all_star[i])
            else:
                dupes = [i]
                for j in range(len(all_star)):
                    if i ==j:
                        continue
                    # if duplicates
                    if all_star[j] == all_star[i]:
                        dupes.append(j)

                best_fit_positon = dupes[0]
                best_fit_points = all_star_rating[dupes[0]]

                for k in dupes:
                    if all_star_rating[k] > best_fit_points:
                        best_fit_points = all_star_rating[k]
                        best_fit_positon = k



                finalized[best_fit_positon] = True
                skip_list.add(all_star[best_fit_positon])


#     print("The best Point Guard in the NBA " + str(conference) +" conference is "+ str(best_pg) + " with a PE of "+ str(max_pe_pg))
#     print("The best Shooting Guard in the NBA " + str(conference) +" conference is "+ str(best_sg) + " with a PE of "+ str(max_pe_sg))
#     print("The best Center in the NBA " + str(conference) + " conference is "+ str(best_c) + " with a PE of "+ str(max_pe_c))
#     print("The best Power Forward in the NBA " + str(conference) + " is "+ str(best_pf) + " with a PE of "+ str(max_pe_pf))
#     print("The best Small Forward in the NBA " + str(conference) + " is "+ str(best_sf) + " with a PE of "+ str(max_pe_sf))
    image = Image.open('basketball_positions.png')

    plt.imshow(image)
    a1 = plt.annotate(best_pg, (600,500))
    a2 = plt.annotate(best_sg, (200,650))
    a3 = plt.annotate(best_c, (830,800))
    a4 = plt.annotate(best_pf, (400,1000))
    a5 = plt.annotate(best_sf, (980,1100))
    plt.title('Conference ' + str(conference))
    plt.savefig('../frontend/src/'+str(conference)+'.png')
    a1.remove()
    a2.remove()
    a3.remove()
    a4.remove()
    a5.remove()



    # plt.show()
    pg_player = player(best_pg,max_pe_pg,Positions[0])
    sg_player = player(best_sg,max_pe_sg,Positions[1])
    c_player = player(best_c,max_pe_c,Positions[2])
    pf_player = player(best_pf,max_pe_pf,Positions[3])
    sf_player = player(best_sf,max_pe_sf,Positions[4])

    return [pg_player,sg_player,c_player,pf_player,sf_player]


# In[6]:


def playerinNewPosition(name, position, position_soln):
    for row in myresult:
        if row[0] == name:

            factors = row[1:11] 
            new_pe = 0

            # dot product
            for i in range(len(factors)):
                new_pe += float(factors[i]) * float(position_soln[i])

            print("If " + str(name) + ' plays as a ' + str(position) + ' he is expected to have a PE of ' + str(new_pe) )
            return new_pe
    print("Player not found")
    return None


# In[7]:


# print(playerinNewPosition('LeBron James', 'Small Forward', solution_pg))


# In[8]:


east_arr = find_all_star_team("East")
west_arr = find_all_star_team("West")
# self.name = name
# self.pe = pe
# self.position = position
for obj in east_arr:
    print(str(obj.name) + ';' + str(obj.position) + ';' + str(obj.pe)[0:4] + ';'  + "East" + ';'   )

for obj in west_arr:
    print(str(obj.name) + ';' + str(obj.position) + ';' + str(obj.pe)[0:4] + ';'  + "West" + ';'   )


# In[ ]:





# In[ ]:




