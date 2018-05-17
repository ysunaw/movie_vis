import numpy as np
import pandas as pd
import ast
import json

def return_time(float):
    d_start = -1262304000
    d_end = 1514764800
    unix_time = (d_end - d_start)*float+d_start
    return pd.to_datetime(unix_time, unit='s').to_period('d').to_timestamp()



class table_loader():
    def __init__(self):
        self.movie_actorDF = pd.read_csv("final_MovieToActor.csv",index_col=0)
        self.actorDF = pd.read_csv("final_Actors.csv", index_col=0)
        self.metaDataDF = pd.read_csv("final_MoviesMetaData_processed.csv", index_col=0)
        self.metaDataDF['release_date'] = pd.to_datetime(self.metaDataDF['release_date'])
        self.movie_to_genreDF = pd.read_csv('final_MovieToGenre.csv', index_col=0)
        self.Mean = 1
        self.actorDF['actor_id'] = self.actorDF.index
        max_num=200
        start_t = return_time(0)
        end_t = return_time(1)
        time_contrainedMetaFD = self.metaDataDF[(self.metaDataDF['release_date'] > start_t) & (self.metaDataDF['release_date'] < end_t)]
        genres = "All"
        if genres == 'All':
            pass
        else:
            table = self.movie_to_genreDF[self.movie_to_genreDF.name.isin(genres)][['id','name']].groupby('id').count()
            table = table[table.name==len(genres)]
            table['id']= table.index
            time_contrainedMetaFD = pd.merge(table,time_contrainedMetaFD)
        start_d = pd.to_datetime(start_t)
        end_d = pd.to_datetime(end_t)
        scoreDF = pd.merge(self.movie_actorDF, time_contrainedMetaFD)[['actor_id', 'final_score']].groupby('actor_id').sum()
        scoreDF = scoreDF / scoreDF.sort_values('final_score', ascending=False).iloc[:max_num].sum()
        time_contrainedMetaFD = (time_contrainedMetaFD.assign(relative_position=(time_contrainedMetaFD.release_date - start_d) / (end_d - start_d)))
        self.time_contrainedMetaFD=time_contrainedMetaFD

    def return_filtered(self, start_float, end_float, max_num=50, genres='All'):

        start_t = return_time(start_float)
        end_t = return_time(end_float)
        time_contrainedMetaFD = self.metaDataDF[(self.metaDataDF['release_date'] > start_t) & (self.metaDataDF['release_date'] < end_t)]
        print('eeee')
        if genres == 'All':
            pass
        else:
            table = self.movie_to_genreDF[self.movie_to_genreDF.name.isin(genres)][['id','name']].groupby('id').count()
            table = table[table.name==len(genres)]
            table['id']= table.index

            time_contrainedMetaFD = pd.merge(table,time_contrainedMetaFD)
        start_d = pd.to_datetime(start_t)
        end_d = pd.to_datetime(end_t)
        scoreDF = pd.merge(self.movie_actorDF, time_contrainedMetaFD)[['actor_id', 'final_score']].groupby('actor_id').sum()
        scoreDF = scoreDF / scoreDF.sort_values('final_score', ascending=False).iloc[:max_num].sum()
        time_contrainedMetaFD = (time_contrainedMetaFD.assign(relative_position=(time_contrainedMetaFD.release_date - start_d) / (end_d - start_d)))
        self.time_contrainedMetaFD=time_contrainedMetaFD
        final_table = pd.merge(self.movie_actorDF, time_contrainedMetaFD)[['actor_id', 'relative_position']].groupby(
            'actor_id').mean().join(self.actorDF).join(scoreDF).sort_values('final_score', ascending=False).iloc[:max_num]
        final_table = final_table.assign(actor_id=final_table.index)
        #columns_table = self.return_revenue_chart(num_columns,self.Mean)
        #return final_table.to_csv()#.to_json(orient='index')#.to_csv()#, ','.join(columns_table.astype(str))) #.to_json(orient='index')
        return json.dumps(final_table.to_dict('records'))

    def return_revenue_chart(self, num_columns, Mean = 1):
        self.mean = Mean
        if Mean:
            return pd.DataFrame(self.time_contrainedMetaFD[self.time_contrainedMetaFD.revenue!=0].groupby(
            pd.cut(self.time_contrainedMetaFD[self.time_contrainedMetaFD.revenue!=0]["relative_position"],
                np.arange(0, 1.0 + 1 / num_columns, 1 / num_columns)))['revenue'].mean().reset_index()['revenue']).to_csv()
        else:
            return pd.DataFrame(self.time_contrainedMetaFD[self.time_contrainedMetaFD.revenue!=0].groupby(
            pd.cut(self.time_contrainedMetaFD[self.time_contrainedMetaFD.revenue!=0]["relative_position"],
                np.arange(0, 1.0 + 1 / num_columns, 1 / num_columns)))['revenue'].sum().reset_index()['revenue']).to_csv()

    def return_actor_network(self,actor_id):
        pd.merge(pd.merge(self.movie_actorDF[self.movie_actorDF.actor_id == actor_id], self.metaDataDF), self.movie_to_genreDF)
        DF = pd.merge(
            pd.merge(pd.merge(self.movie_actorDF[self.movie_actorDF.actor_id == actor_id], self.metaDataDF), self.movie_to_genreDF)[
                ['id', 'genre_id']], self.movie_actorDF)
        DF2 = DF[DF.actor_id != actor_id].drop_duplicates(['id', 'actor_id'])
        #self.actorDF.loc[:,'actor_id'] = self.actorDF.index
        DF3 = pd.merge(DF2, self.actorDF)
        DF4 = DF3.sort_values('all_time_final_score', ascending=False).iloc[:50]
        actor_dictionary = self.actorDF[['name', 'gender', 'all_time_final_score','actor_id']].to_dict(orient='index')
        actor_set = set()
        actor_dict_list = [{'name': actor_dictionary[actor_id]['name'], 'gender': actor_dictionary[actor_id]['gender'],
                            'score': actor_dictionary[actor_id]['all_time_final_score'], 'actor_id':actor_dictionary[actor_id]['actor_id']}]
        links_list = []
        skip = 0
        for index, (index_row, row) in enumerate(DF4.iterrows()):

            links_list.append({'source': actor_dictionary[actor_id]['name'], "target": actor_dictionary[row.actor_id]['name'], 'value': row.genre_id})
            if row.actor_id in actor_set:
                skip += 1
                continue
            #print(row)
            actor_set.add(row.actor_id)
            actor_dict_list.append(
                {'name': actor_dictionary[row.actor_id]['name'], 'gender': actor_dictionary[row.actor_id]['gender'],
                 'score': actor_dictionary[row.actor_id]['all_time_final_score'], 'actor_id':actor_dictionary[row.actor_id]['actor_id']})
        return json.dumps({"actors":actor_dict_list, "movies":links_list})
        
    def return_cloud_points(self,actor_id):
        
        start_t = return_time(0)
        end_t = return_time(1)
        start_d = pd.to_datetime(start_t)
        end_d = pd.to_datetime(end_t)
        DF = pd.merge(self.movie_actorDF[self.movie_actorDF.actor_id == actor_id],self.metaDataDF)#
        DF.loc[:,'relative_position'] = (DF.release_date - start_d) / (end_d - start_d)
        #DF.loc[:,'circle_size'] = DF['score']/DF['score'].sum()
        return json.dumps(DF[['id', 'title', 'relative_position', 'vote_average', 'score']].to_dict(
            'records'))  # .to_json(orient='index')
        
        
if __name__ == '__main__':
    loader = table_loader()
    print(loader.return_filtered('1960','2018',10,['Comedy']))